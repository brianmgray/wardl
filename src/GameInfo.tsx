import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import {
  wardlNumber,
  nextWardl,
} from "./util";

interface GameInfoProps {
  launchDate: DateTime,
  seedDate: DateTime,
  gameNumber: number
}

const COUNTDOWN_INTERVAL:number = 1000;

/**
 * Game info displays below the game, including the countdown to the next Wardl
 * @param props 
 * @returns 
 */
export function GameInfo(props: GameInfoProps) {
  const [nextWardlCounter, setNextWardlCounter] = useState(""); // the clock for the next Wardl

  useEffect(() => {
    let interval = setInterval(() => {
      setNextWardlCounter(nextWardl());
    }, COUNTDOWN_INTERVAL);
    return () => clearInterval(interval);
  }, [props.seedDate, nextWardlCounter]);

  return (
    <div className="Game-info">
        <div className="Game-wardl-num">
          #{wardlNumber(props.launchDate, props.seedDate)}
        </div>
        <div className="Game-next" >
          { nextWardlCounter !== "" 
              ? <h3>Next&nbsp;Wardl:&nbsp;{nextWardlCounter}</h3>
              : null
          }
        </div>
        <div className="Game-num">
          {props.gameNumber > 1 ? "Game " + props.gameNumber : ""}
        </div>
    </div>
  );
}
