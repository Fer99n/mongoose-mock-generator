import { Generator } from './Generator'

export class MockGenerator extends Generator {
    generateMock() {
        const result = {}
        MockGenerator.deepSearch(this.schema.obj, result)
        // eslint-disable-next-line no-console
        console.log('RESULT', result)
    }
}
