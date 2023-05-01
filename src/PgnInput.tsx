import React, { useEffect, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import {
  Autocomplete,
  Divider,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

type Author = 'PgnImport' | 'MoveList';

const PgnInput = () => {
  const useStyles = makeStyles()((theme) => ({
    moveList: {
      marginBottom: theme.spacing(2),
    },
  }));

  const { classes } = useStyles();

  const [pgn, setPgn] = React.useState('');
  const [author, setAuthor] = React.useState<Author>('PgnImport');

  const chess = useMemo(() => {
    const c = new Chess();
    try {
      c.loadPgn(pgn);
    } catch (e) {}
    return c;
  }, [pgn]);

  const changeMove = (ply: number, move: string) => {
    const moves = chess.history();
    moves[ply] = move;

    const newChess = new Chess();
    for (const move of moves) {
      try {
        newChess.move(move);
      } catch (e) {
        // Illegal move, probably because we rewrote history
        break;
      }
    }

    setAuthor('MoveList');
    setPgn(newChess.pgn());
  };

  return (
    <>
      <div className={classes.moveList}>
        <MoveList chess={chess} changeMove={changeMove} author={author} />
      </div>
      <textarea
        placeholder="Paste PGN here"
        value={pgn}
        onChange={(e) => {
          setPgn(e.target.value);
          setAuthor('PgnImport');
        }}
        rows={5}
        cols={50}
      />
    </>
  );
};

const MoveList = ({
  chess,
  changeMove,
  author,
}: {
  chess: Chess;
  changeMove: (ply, move) => void;
  author: Author;
}) => {
  const useStyles = makeStyles()((theme) => ({
    movePair: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing(1),
      width: '480px',
    },
  }));

  const { classes } = useStyles();

  const plies = useMemo(() => chess.history(), [chess]);
  const movePairs = useMemo(
    () => padMovePairs([...pliesToMovePairs(plies)]),
    [plies]
  );

  const nextElement = useRef(null);
  useEffect(() => {
    if (author === 'MoveList' && nextElement.current) {
      const el = getFirstInputDescendent(nextElement.current);
      el.focus();
    }
  }, [nextElement, chess, author]);

  const filterOptions = createFilterOptions({ matchFrom: 'start' });

  return (
    <div>
      {movePairs.map(([whiteMove, blackMove], i) => (
        <div className={classes.movePair} key={i}>
          <Autocomplete
            value={whiteMove ?? ''}
            onChange={(_, v) => changeMove(i * 2, v)}
            options={legalMovesAtPly(chess, i * 2)}
            autoSelect
            autoHighlight
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="standard"
                fullWidth
                placeholder="White Move"
                ref={whiteMove === undefined ? nextElement : undefined}
              />
            )}
          />
          <Autocomplete
            value={blackMove ?? ''}
            onChange={(_, v) => changeMove(i * 2 + 1, v)}
            options={legalMovesAtPly(chess, i * 2 + 1)}
            autoSelect
            autoHighlight
            disabled={!chess.history()[i * 2]}
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="standard"
                fullWidth
                placeholder="Black Move"
                ref={
                  blackMove === undefined && whiteMove !== undefined
                    ? nextElement
                    : undefined
                }
              />
            )}
          />
        </div>
      ))}
    </div>
  );
};

// Will return undefined for final move
function* pliesToMovePairs(plies: string[]): Generator<[string?, string?]> {
  for (let i = 0; i < plies.length; i += 2) {
    yield [plies[i], plies[i + 1]];
  }
}

// Adds a pair of null moves if the last ply is a non-null move
const padMovePairs = (movePairs: [string?, string?][]) => {
  if (movePairs.length === 0) {
    return [[undefined, undefined]];
  }

  return movePairs[movePairs.length - 1][1] === undefined
    ? movePairs
    : [...movePairs, [undefined, undefined]];
};

const legalMovesAtPly = (chess: Chess, ply: number) => {
  const replacedMove = chess.history({ verbose: true })[ply];
  if (!replacedMove) {
    return chess.moves();
  }

  const newChess = new Chess(chess.history({ verbose: true })[ply].before);
  return newChess.moves();
};

const getFirstInputDescendent = (element: HTMLElement) => {
  const input = element?.querySelector('input');
  if (input) {
    return input;
  }

  return null;
};

const descendentIsFocused = (element: HTMLElement) => {
  if (element === document.activeElement) {
    return true;
  }
  for (const child of element.children) {
    if (descendentIsFocused(child as HTMLElement)) {
      return true;
    }
  }
  return false;
};

export default PgnInput;
