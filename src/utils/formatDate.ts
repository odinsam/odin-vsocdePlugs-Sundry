export class FormatDate {
    constructor(private readonly date: Date | null | undefined) {
        this.date = date ?? new Date();
    }
    FullYear: number = this.date!.getFullYear();
    public Months: number = this.date!.getMonth() + 1;
    public FullMonths: string =
        this.date!.getMonth() + 1 < 10
            ? '0' + (this.date!.getMonth() + 1)
            : (this.date!.getMonth() + 1).toString();
    public Day: number = this.date!.getDate();
    public FullDay: string =
        this.date!.getDate() < 10
            ? '0' + this.date!.getDate()
            : this.date!.getDate().toString();
    public Hours = this.date!.getHours();
    public FullHours =
        this.date!.getHours() < 10
            ? '0' + this.date!.getHours()
            : this.date!.getHours().toString();
    public Minutes = this.date!.getMinutes();
    public FullMinutes =
        this.date!.getMinutes() < 10
            ? '0' + this.date!.getMinutes()
            : this.date!.getMinutes().toString();
    public Seconds = this.date!.getSeconds();
    public FullSeconds =
        this.date!.getSeconds() < 10
            ? '0' + this.date!.getSeconds()
            : this.date!.getSeconds().toString();

    GetDateTimeString = (): string => {
        return (
            this.FullYear +
            '-' +
            this.Months +
            '-' +
            this.FullDay +
            ' ' +
            this.FullHours +
            ':' +
            this.FullMinutes +
            ':' +
            this.FullSeconds
        );
    };
    GetDateString = (): string => {
        return this.FullYear + '-' + this.Months + '-' + this.FullDay;
    };
    GetTimeString = (): string => {
        return this.FullHours + ':' + this.FullMinutes + ':' + this.FullSeconds;
    };
}
