import {DemoDataObject} from "../models/demo-data-object";
import {Mongo} from "meteor/mongo";

export const DemoCollection = new Mongo.Collection<DemoDataObject>('demo-collection');