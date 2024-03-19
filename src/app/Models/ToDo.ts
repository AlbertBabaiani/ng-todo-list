export class Todo{
    constructor(
        private _id: number = 0,
        private _task: string = '',
        private _checked: boolean = false,
        private _date: Date
    ){}

    set id(set_id: number){
        this._id = set_id
    }
    get id(): number{
        return this._id
    }

    set task(set_task: string){
        this._task = set_task
    }
    get task(): string{
        return this._task
    }

    set checked(set_cheked: boolean){
        this._checked = set_cheked
    }
    get checked(): boolean{
        return this._checked
    }

    set date(set_date: Date){
        this._date = set_date
    }

    get date(): Date{
        return this._date
    }
}