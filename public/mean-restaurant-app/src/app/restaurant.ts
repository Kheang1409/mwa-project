import { NgForm } from "@angular/forms";

export class Location {
    #_id!: string;
    #city!: string;
    #state!: string;
    #country!: string

    get _id(): string {
        return this.#_id;
    }
    get city(): string {
        return this.#city;
    }
    get state(): string {
        return this.#state;
    }
    get country(): string {
        return this.#country;
    }

    set _id(id: string) {
        this.#_id = id;
    }
    set city(city: string) {
        this.#city = city;
    }
    set state(state: string) {
        this.#state = state;
    }
    set country(country: string) {
        this.#country = country;
    }

    constructor() {

    }

    fill(form: NgForm) {
        this._id = form.value.id;
        this.city = form.value.city;
        this.state = form.value.state;
        this.country = form.value.country;
    }

    jsonify() {
        return {
            city: this.city,
            state: this.state,
            country: this.country
        }
    }
}

export class Dish {
    #_id!: string;
    #title!: string;
    #price!: number;
    #picture!: string;
    #description!: string

    get _id(): string {
        return this.#_id
    }
    get title(): string {
        return this.#title
    }
    get price(): number {
        return this.#price
    }
    get picture(): string {
        return this.#picture
    }
    get description(): string {
        return this.#description
    }

    set _id(id: string) {
        this.#_id = id;
    }

    set title(title: string) {
        this.#title = title;
    }
    set price(price: number) {
        this.#price = price;
    }
    set picture(picture: string) {
        this.#picture = picture;
    }
    set description(description: string) {
        this.#description = description;
    }

    constructor() { }

    fill(form: NgForm) {
        this._id = form.value.id;
        this.title = form.value.title;
        this.price = form.value.price;
        this.picture = form.value.picture;
        this.description = form.value.description;
    }
    jsonify() {
        return {
            title: this.title,
            price: this.price,
            picture: this.picture,
            description: this.description
        }
    }
}

export class Restaurant {
    #_id!: string;
    #name!: string;
    #publishedYear!: number;
    #location!: Location;
    #dishes!: Dish[];
    #about!: string;
    #logo!: string;

    get _id(): string {
        return this.#_id
    }
    get name(): string {
        return this.#name
    }
    get publishedYear(): number {
        return this.#publishedYear
    }
    get location(): Location {
        return this.#location
    }
    get dishes(): Dish[] {
        return this.#dishes
    }
    get about(): string {
        return this.#about
    }
    get logo(): string {
        return this.#logo
    }

    set _id(id: string) {
        this.#_id = id;
    }
    set name(name: string) {
        this.#name = name;
    }
    set publishedYear(publishedYear: number) {
        this.#publishedYear = publishedYear
    }

    set about(about: string) {
        this.#about = about;
    }

    set logo(logo: string) {
        this.#logo = logo;
    }

    set location(location: Location) {
        this.#location = location;
    }

    set dishes(dishes: Dish[]) {
        this.#dishes = dishes
    }

    constructor() {

    }

    fill(form: NgForm) {
        this._id = form.value.id;
        this.name = form.value.name;
        this.publishedYear = form.value.publishedYear;
        this.dishes = [];
        this.about = form.value.about;
        this.logo = form.value.logo;
    }

    jsonify() {
        return {
            name: this.name,
            publishedYear: this.publishedYear,
            about: this.about,
            logo: this.logo,
            location: this.location.jsonify()
        }
    }
}
