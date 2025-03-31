using {Andy} from '../db/data-model';

service CatalogService @(path:'/CatalogService'){
    entity superheroe as projection on Andy.Superheroe;
}