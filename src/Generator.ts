import { Schema, SchemaDefinition, SchemaTypeOptions } from 'mongoose'
import moment = require('moment')

type ObjectId = Schema.Types.ObjectId

export abstract class Generator {
    schema: Schema
    collection: String
    models: Object

    static hasOwnProp(obj: object, prop: string): boolean {
        return Object.prototype.hasOwnProperty.call(obj, prop)
    }

    static getFromType(type: any, key: string): ObjectId | string | number | Date {
        switch (type.name) {
            case 'ObjectId':
                return
            case 'String':
                return `example-${key}`
            case 'Number':
                return 0
            case 'Date':
                return moment(new Date()).add(1, 'hour').toDate()
            default:
                break
        }
    }

    static canInferValue(o: any): boolean {
        return (
            (Generator.hasOwnProp(o, 'type') && !Generator.hasOwnProp(o.type, 'type')) ||
            Generator.hasOwnProp(o, 'default') ||
            Generator.hasOwnProp(o, 'enum') ||
            Array.isArray(o)
        )
    }

    static inferValue(o: SchemaDefinition | SchemaTypeOptions<any>, k: string): string | any {
        if (Array.isArray(o)) {
            if (o[0].name) return Generator.getFromType(o[0], k)
            const r = {}
            Generator.deepSearch(o[0], r)
            return r
        }

        if (Generator.hasOwnProp(o, 'enum')) {
            const first: string = o.enum[0]
            return first
        }

        if (Generator.hasOwnProp(o, 'default'))
            if (typeof o.default === 'function') return o.default()
            else return o.default

        if (Generator.hasOwnProp(o, 'type') && !Generator.hasOwnProp(o.type, 'type'))
            return Generator.getFromType(o.type, k)
    }

    static deepSearch(obj: SchemaDefinition | SchemaTypeOptions<any>, r: object) {
        const o = obj instanceof Schema ? obj.obj : obj

        if (typeof o === 'object' && !Generator.canInferValue(o))
            Object.keys(o).forEach((k) =>
                Generator.canInferValue(o[k]) ? (r[k] = Generator.inferValue(o[k], k)) : Generator.deepSearch(o[k], r)
            )
    }

    constructor(schema: Schema, collection?: String, models?: Object) {
        this.schema = schema
        this.collection = collection
        this.models = models
    }
}
