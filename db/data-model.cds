using { managed, cuid } from '@sap/cds/common';
// cuid can be used to generate an ID from system
namespace Andy;
entity Superheroe: managed, cuid {
        nombreSuperheroe: String(100);
        nombre: String(100);
        franquicia:String(20);
        telefono: String(9);
        edad: String(3);
        fuerza: String(3);
        destreza: String(3);
        intelecto: String(3);
}
