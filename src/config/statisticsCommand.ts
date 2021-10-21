export class StatisticsCommand {
    static StatisticsAll: string =
        'git log  --pretty=tformat: --numstat | awk \'{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\\n", add, subs, loc }\'';
    static StatisticsByTime: string =
        'git log --author=$author$ --since=$beginTime$ --until=$endTime$ --format=\'%aN\' | sort -u | while read name; do echo -en "$name\\t"; git log --author="$name" --pretty=tformat: --numstat | grep "\\($statisticsType$)$" | awk \'{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\\n", add, subs, loc }\' -; done';
}
