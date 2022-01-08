import React from 'react';
import { useQuery } from 'react-query';

export default function UserScore() {
  function fetchScores() {
    return fetch(`http://127.0.0.1/api/userscore?league_game_id=1`).then(
      (response) => response.json()
    );
  }
  function fetchRank() {
    return fetch(`http://127.0.0.1/api/rank?league_game_id=1`).then(
      (response) => response.json()
    );
  }

  function test() {
    console.log(isSuccessRank);
  }

  const {
    isLoading,
    isSuccess,
    data: scores,
  } = useQuery('scores', fetchScores);

  const {
    isLoading: isLoadingRank,
    isSuccess: isSuccessRank,
    data: leaders,
  } = useQuery('leaders', fetchRank);

  function calculateScore(player_id, user_id, fan_point, prediction) {
    var calculated = 0;
    if (fan_point === prediction) {
      if (fan_point < 10) {
        calculated = parseFloat(fan_point + 5);
      } else {
        calculated = parseFloat(fan_point * 1.5);
      }
    } else {
      if (fan_point > prediction) {
        calculated = parseFloat((prediction / fan_point) * prediction);
      }
    }

    return calculated.toString();
  }

  function calculateTotal(user_id) {
    var calculated = 0;
    var scoreElements = document.querySelectorAll(
      '.score' + user_id.toString()
    );

    if (scoreElements.length > 0) {
      scoreElements.forEach((element) => {
        calculated += parseFloat(element.textContent);
      });
    }

    return calculated.toString();
  }

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isSuccess && (
        <div>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            User Scores
          </h3>
          <table className='table-auto'>
            <thead>
              <tr>
                <td colSpan='2'></td>
                {scores.users.map((user) => (
                  <th scope='col' colSpan='2' className='text-center'>
                    {user.name}
                  </th>
                ))}
              </tr>
              <tr>
                <td className='font-bold' scope='row' colSpan='2'>
                  Player
                </td>
                {scores.users.map((user) => (
                  <>
                    <td>Pred</td>
                    <td>Score</td>
                  </>
                ))}
              </tr>
            </thead>
            {scores.players.map((player) => (
              <tr key='{player.player_id}'>
                <td colSpan='2' className='text-left'>
                  {player.player_name}
                </td>
                {scores.users.map((user) => (
                  <>
                    <td>
                      {scores.userPredictions[player.player_id][user.user_id]}
                    </td>
                    <td
                      key={
                        player.player_id.toString() +
                        '-' +
                        user.user_id.toString()
                      }
                      className={'score' + user.user_id.toString()}
                    >
                      {(
                        Math.round(
                          calculateScore(
                            player.player_id,
                            user.user_id,
                            player.fan_point,
                            scores.userPredictions[player.player_id][
                              user.user_id
                            ]
                          ) * 100
                        ) / 100
                      ).toFixed(2)}
                    </td>
                  </>
                ))}
              </tr>
            ))}
            <tr>
              <td className='font-bold text-right' colSpan='2'>
                Total
              </td>
              {scores.users.map((user) => (
                <>
                  <td
                    key={'total' + user.user_id.toString()}
                    colSpan='2'
                    className='text-center'
                  >
                    {(
                      Math.round(calculateTotal(user.user_id) * 100) / 100
                    ).toFixed(2)}
                  </td>
                </>
              ))}
            </tr>
          </table>
        </div>
      )}
      <button onClick={() => test()}>GO</button>
      {isLoadingRank && <div>Loading...</div>}
      {isSuccessRank && (
        <>
          <h2>Leaderboard</h2>

          <ol className='p-3 list-decimal'>
            {leaders.ranking.map((rank) => (
              <li className='mx-10 px-10 text-left' key={rank.name}>
                {rank.name +
                  ' (' +
                  (Math.round(rank.score * 100) / 100).toFixed(2) +
                  ')'}{' '}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
