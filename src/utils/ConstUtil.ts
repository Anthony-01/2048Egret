namespace utils {
    export class ConstUtil {

    }

    export function colorConsole(msg: string, color: string = "red", fontSize: number = 1.5, data?: any) {
        console.log(`%c${msg}`, `color: ${color}; font-size: ${fontSize}`);
        console.log(data);
    }
}