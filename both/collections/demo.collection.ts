import { MongoObservable } from 'meteor-rxjs';
import {Demo} from "../models/demo.model";

export const DemoCollection = new MongoObservable.Collection<Demo>('demo-collection');