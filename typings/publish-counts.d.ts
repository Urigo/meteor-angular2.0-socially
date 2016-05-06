interface CountsObject {
  get(publicationName : string) : number;
  publish(context : any, publicationName : string, cursor : Mongo.Cursor, options : any) : number;
}

declare module "meteor/tmeasday:publish-counts" {
  export let Counts : CountsObject;
}