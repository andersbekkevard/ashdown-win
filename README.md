# ashdown.win

The table tennis ladder for Ashdown House at MIT. One table, one leaderboard,
one rating per player. Record a match, watch the numbers move.

Live at [ashdown.win](https://ashdown.win).

## How it works

There are no accounts. You create a player once, under your name, and from
then on anyone can record a match between any two players. The winner gains
rating points, the loser gives them up, and the leaderboard updates
immediately. Every match ever recorded is public, so every rating can be
traced back to the games that produced it.

Doubles count too. A doubles team plays as the average of its two ratings, and
both partners move by the same amount, at half the weight of a singles match.

Filed a match wrong? Delete it. The deletion shows up in the log like anything
else. Cheating is possible and would be visible, which in a house of a few
hundred people is enough.

## The rating

Standard Elo, the same formula chess uses. Expected score against an opponent is

    E = 1 / (1 + 10^((R_opponent - R_you) / 400))

and after the match your rating becomes

    R' = R + K * (S - E)

where S is 1 for a win and 0 for a loss. K is 32 for singles and 16 for
doubles. Everyone starts at 1000. The full derivation, including how doubles
is handled, is on the algorithm page of the site and in
[docs/algorithm.md](docs/algorithm.md).

Ratings are never stored. They are recomputed from the match log every time,
so a change to the constants or the formula applies to all of history at once.

## Contributing

The code is open so that anyone in the house can check the maths or add a
feature. Open an issue or a pull request. Design rationale and the record of
every decision so far live under [docs/](docs/README.md).

## Licence

MIT.
