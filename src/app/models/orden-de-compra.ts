import { Proovedores } from "./proovedores";

export class OrdenDeCompra {
    constructor(
        public id : number,
        public proveedor: Proovedores,
        public orden: string,
        public estado: string
    ){}

}
