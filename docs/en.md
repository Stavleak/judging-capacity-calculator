# Plan the judging window

## Define the unit of work

A review includes reading the submission, checking the evidence, recording criterion scores and writing the required comment. Estimate `reviewMinutes` with two practice submissions. A three-minute pitch is not automatically a three-minute review.

Use `projects` for eligible submissions, not registered teams. Use `reviewsPerProject` for distinct judges who must review each project. `judges` counts available judges, excluding people who are still being invited.

## Calculate complete review slots

For P projects, R reviews per project, M minutes per review, W available minutes and U usable fraction:

```text
total reviews = P × R
judge-minutes = P × R × M
usable minutes per judge = W × U
complete reviews per judge = floor(W × U / M)
judges needed = max(R, ceil(P × R / complete reviews per judge))
```

The total-time estimate is also reported. It may understate headcount because a fraction of a review cannot be moved into another judge's remaining minutes. If a review is longer than the entire usable window, the slot calculation returns `null` for the required headcount. Increase the window or change the review format before inviting more judges.

## Use your own reserve

`usableFraction` is a planning assumption, not an industry benchmark. Choose it after accounting for briefing, breaks, score entry, technical incidents and reconciliation. The example uses 0.75 to make the calculation visible. It does not claim that real events achieve 75% utilization.

## Check assignment feasibility

An arithmetic fit does not prove an assignable roster. For each project, list eligible judges after conflicts, track expertise and time restrictions. Confirm that it has at least R distinct eligible judges. Check peak load and ensure breaks are still available. A shared review panel has different scheduling constraints from independent asynchronous reviews.

## Before publishing the schedule

Record the source of the project count, the timed sample reviews, window length, reserve and who owns the roster. Recalculate after eligibility checks or a roster change. Freeze the published criteria before teams start; adding judge capacity does not require quietly changing scoring weights.
