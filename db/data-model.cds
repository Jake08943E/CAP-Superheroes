
using {

    managed
} from '@sap/cds/common';

namespace jmsolera;

entity superheroe : managed {
    key id             : String;
    nombresuperheroe : String(100);
    nombre           : String(100);
    franquicia       : String(20);
    telefono         : String(9);
    edad             : String(10);
    fuerza           : String(3);
    destreza         : String(3);
    intelecto        : String(3);
    }
