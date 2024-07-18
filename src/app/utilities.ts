export class Utilities {

    static getDateAsString(date: Date): string {
        return `${date.getDate()} de ${Utilities.getMonthName(date.getMonth())} de ${date.getFullYear()} a ${date.getHours() > 1 ? 'las' : 'la'} ${date.getHours()}:${date.getMinutes()}`;
    }

    private static getMonthName(month: number): string {
        switch (month) {
            case 0: return "enero";
            case 1: return "febrero";
            case 2: return "marzo";
            case 3: return "abril";
            case 4: return "mayo";
            case 5: return "junio";
            case 6: return "julio";
            case 7: return "agosto";
            case 8: return "septiembre";
            case 9: return "octubre";
            case 10: return "noviembre";
            case 11: return "diciembre";
            default:
                return "";
        }
    }
}
