import { Schema, SchemaDefinition, SchemaTypeOptions, Types } from 'mongoose'
import moment = require('moment')

export abstract class Generator {
    protected schema: Schema

    static hasOwnProp(obj: object, prop: string): boolean {
        try {
            return Object.prototype.hasOwnProperty.call(obj, prop)
        } catch (e) {
            console.log('Cannot check prop', obj, prop)
        }
    }

    static getFromType(type: any, key: string): string | number | Date {
        switch (type.name) {
            case 'ObjectId':
                return new Types.ObjectId().toString()
            case 'String':
                return `example-${key}`
            case 'Number':
                return 0
            case 'Date':
                return moment(new Date()).add(1, 'hour').toDate()
            default:
                return undefined
        }
    }

    static canInferValue(o: any): boolean {
        return (
            !!o.obj ||
            (Generator.hasOwnProp(o, 'type') && !Generator.hasOwnProp(o.type, 'type')) ||
            Generator.hasOwnProp(o, 'default') ||
            Generator.hasOwnProp(o, 'enum') ||
            Array.isArray(o)
        )
    }

    static inferValue(o: SchemaDefinition | SchemaTypeOptions<any>, k: string): string | any {
        try {
            if (o.obj) {
                const r = {}
                Generator.generate(o.obj, r)
                return r
            }

            if (Array.isArray(o)) {
                if (typeof o[0] === 'function' && o[0].name) return Generator.getFromType(o[0], k)
                const r = {}
                Generator.generate(o[0].obj || o[0], r)
                return [r]
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
        } catch (e) {
            console.error('Cannot infer value for: ', o, k)
            return undefined
        }
    }

    static generate(o: SchemaDefinition | SchemaTypeOptions<any>, r: object) {
        if (typeof o === 'object' && !Generator.canInferValue(o))
            Object.keys(o).forEach((k) =>
                Generator.canInferValue(o[k]) ? (r[k] = Generator.inferValue(o[k], k)) : Generator.generate(o[k], r)
            )
    }

    constructor(schema?: Schema) {
        this.schema = schema
    }
}
