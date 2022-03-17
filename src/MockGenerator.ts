import { Generator } from './Generator'
import { Schema } from 'mongoose'

export class MockGenerator extends Generator {
    generateMock(schema?: Schema) {
        this.schema = schema || this.schema
        if (!schema) throw Error()
        const result = {}
        MockGenerator.generate(this.schema.obj, result)
        // eslint-disable-next-line no-console
        console.log('RESULT', result)
    }
}
