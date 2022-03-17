import { Generator } from './Generator'
import { Schema } from 'mongoose'
const fs = require('fs')

const defaultFileName = './output.json'
interface JsonOpt {
    fileName?: String
}
interface Options {
    json?: JsonOpt & boolean
    name?: String
}

export class MockGenerator extends Generator {
    private options: Options
    private mocks: Array<Object>
    private name: String

    constructor(schema?: Schema, opt?: Options) {
        super(schema)
        this.options = opt
        this.name = opt?.name
        this.mocks = []
    }

    mock(schema?: Schema, name?: string) {
        if (schema) this.schema = schema
        if (name) this.name = name
        if (!this.schema) throw Error('No schema specified')
        const result = {}
        MockGenerator.generate(this.schema.obj, result)
        if (this.name) {
            this.mocks.push({ [this.name + 'Mock']: result })
        } else this.mocks.push(result)
        return this
    }

    print(opt?: Options) {
        if (opt) this.options = opt
        if (this.options?.json) {
            const fileName = this.options?.json?.fileName || defaultFileName
            fs.writeFile(fileName, JSON.stringify(this.mocks), function (err) {
                if (err) throw err
            })
        } else console.log(this.mocks)
        return this
    }
}
