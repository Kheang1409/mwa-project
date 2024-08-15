import { FormGroup } from "@angular/forms";

export class User {
    #_id: string = '';
    #name: string = '';
    #username: string = '';
    #password: string = '';

    get _id(): string {
        return this.#_id;
    }
    get name(): string {
        return this.#name;
    }
    get username(): string {
        return this.#username;
    }
    get password(): string {
        return this.#password;
    }
    set username(username: string) {
        this.#username = username
    }
    set password(passowrd: string) {
        this.#password = passowrd
    }
    set name(name: string) {
        this.#name = name;
    }

    fill(form: FormGroup) {
        this.name = form.value.name;
        this.username = form.value.username;
        this.password = form.value.password;
    }

    jsonify() {
        return {
            username: this.username,
            password: this.password,
        }
    }
    jsonifyCreate() {
        return {
            name: this.name,
            username: this.username,
            password: this.password,
        }
    }
}