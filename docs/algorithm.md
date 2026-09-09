# How the rating works

Everyone starts at 1000. When you beat someone, you take points
from them; how many depends on how surprising the result was. Beating a
stronger player earns more than beating a weaker one. There are no accounts, every
match is public, and a mistake can be undone.

## Update

The expected score of a player rated $R_a$ against one rated $R_b$ is

$$
E_a = \frac{1}{1 + 10^{(R_b - R_a)/400}}
$$

After the match, with $S_a = 1$ for a win and $0$ for a loss,

$$
R_a' = R_a + K\,(S_a - E_a)
$$

and the opponent moves by exactly the opposite amount. $K$ is 32 for singles.
Against an equal opponent a win is worth 16 points; against someone rated 400
higher it is worth about 29. This is the same rule chess uses.

## Doubles

A pair plays as one virtual player rated at the average of the two. The
expected score comes from the two team averages as above, and both partners
receive the same change, with $K = 16$, half the singles value, because a
doubles result says less about any one player.

## Recording, deleting, restoring

The log is append-only. Recording a match adds an entry. Deleting adds an
entry that voids a match, and restoring adds an entry that cancels a deletion.
Every entry stays visible, so a wrong tap is always reversible and never
hidden.

Each entry also stores a short anonymous label derived from a random cookie on
the phone that made it. It identifies no one and holds no personal data; it
only lets the log show when several actions came from the same phone.

The code that implements this is open: github.com/andersbekkevard/ashdown-win.
