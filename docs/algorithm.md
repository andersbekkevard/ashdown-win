# The ashdown.win rating

This is the source for the site's algorithm page. It is meant to be read in
five minutes by someone who wants to check the maths.

## Singles

Each player $i$ has a rating $R_i$. Every player starts at $R_0 = 1000$.

When players $a$ and $b$ play, the expected score of $a$ is

$$
E_a = \frac{1}{1 + 10^{(R_b - R_a)/400}}
$$

and symmetrically $E_b = 1 - E_a$. The actual score $S_a$ is $1$ if $a$ won
and $0$ otherwise. After the match,

$$
R_a' = R_a + K_s\,(S_a - E_a), \qquad R_b' = R_b + K_s\,(S_b - E_b)
$$

with $K_s = 32$. The two updates sum to zero, so total rating in the system is
conserved apart from new players entering at $R_0$.

## Doubles

A doubles team $\{a, b\}$ plays as a single virtual player with rating

$$
R_{ab} = \frac{R_a + R_b}{2}.
$$

The expected score of the team is computed from the two team ratings exactly
as in singles. Each member of a team then receives the same update,

$$
\Delta = K_d\,(S - E_{\text{team}}),
$$

with $K_d = 16$, half the singles constant. Two reasons for the half weight:
a doubles result says less about any one player than a singles result does,
and it keeps a run of doubles from swinging the singles order.

This is the convention used by most amateur racket ladders. Rigorous
alternatives such as TrueSkill model each player as a distribution and treat
team skill as a sum; they are better in theory and unnecessary here.

## Derivation from the log

No rating is stored. The match log is an ordered list of entries, each either
a match or a deletion of an earlier match. To compute the current ratings,
start every player at $R_0$ and apply every non-deleted match in order using
the rules above. A player's rating history is the sequence of values this
process assigns them.

Because the computation is a pure function of the log and the constants,
changing $K_s$, $K_d$ or $R_0$ recomputes all of history consistently.

## What K means

$K$ bounds the rating change from a single match. At $K_s = 32$, beating an
equal opponent gains 16 points; beating an opponent rated 400 higher gains
about 29; losing to one rated 400 lower costs about 29. The value is a
compromise between responsiveness, which makes early matches feel consequential,
and stability, which stops one lucky win from rearranging the board.

Chess federations reduce $K$ for experienced players. This ladder uses a fixed
$K$ deliberately, to keep the rule explainable in one line. See the decision
ledger for the condition under which that changes.
