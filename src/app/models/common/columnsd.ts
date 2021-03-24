export class ColumnD<T> {
    field?: string = "";
    header: string;
    display?: string;

    template?(e: T) : any{
        return null;
    }
}
