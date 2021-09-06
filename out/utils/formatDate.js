"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDate = void 0;
class FormatDate {
    constructor(date) {
        this.date = date;
        this.FullYear = this.date.getFullYear();
        this.Months = this.date.getMonth() + 1;
        this.FullMonths = this.date.getMonth() + 1 < 10
            ? '0' + (this.date.getMonth() + 1)
            : (this.date.getMonth() + 1).toString();
        this.Day = this.date.getDate();
        this.FullDay = this.date.getDate() < 10
            ? '0' + this.date.getDate()
            : this.date.getDate().toString();
        this.Hours = this.date.getHours();
        this.FullHours = this.date.getHours() < 10
            ? '0' + this.date.getHours()
            : this.date.getHours().toString();
        this.Minutes = this.date.getMinutes();
        this.FullMinutes = this.date.getMinutes() < 10
            ? '0' + this.date.getMinutes()
            : this.date.getMinutes().toString();
        this.Seconds = this.date.getSeconds();
        this.FullSeconds = this.date.getSeconds() < 10
            ? '0' + this.date.getSeconds()
            : this.date.getSeconds().toString();
        this.GetDateTimeString = () => {
            return (this.FullYear +
                '-' +
                this.Months +
                '-' +
                this.FullDay +
                ' ' +
                this.FullHours +
                ':' +
                this.FullMinutes +
                ':' +
                this.FullSeconds);
        };
        this.GetDateString = () => {
            return this.FullYear + '-' + this.Months + '-' + this.FullDay;
        };
        this.GetTimeString = () => {
            return this.FullHours + ':' + this.FullMinutes + ':' + this.FullSeconds;
        };
        this.date = date !== null && date !== void 0 ? date : new Date();
    }
}
exports.FormatDate = FormatDate;
//# sourceMappingURL=formatDate.js.map