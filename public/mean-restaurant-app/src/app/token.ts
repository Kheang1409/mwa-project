export class Token {
    #token: string = ''
    get token(): string {
        return this.#token;
    }
    set token(token: string) {
        this.#token = token;
    }
    constructor(token: string) {
        this.#token = token;
    }
}
