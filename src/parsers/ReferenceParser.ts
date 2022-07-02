import { random } from 'lodash';
import { IParser, IFixture } from '../interface';

export class ReferenceParser implements IParser {
    /**
     * @type {number}
     */
    public priority = 50;

    isSupport(value: string): boolean {
        return value.indexOf('@') === 0;
    }

    parse(value: string, fixture: IFixture, entities: any): any {
        let result;

        if (value.substring(value.length - 1) === '*') {
            const prefix = value.substring(1, value.length);
            const regex = new RegExp(`^${prefix}([0-9]+)$`);
            const maskEntities = Object.keys(entities).filter((s: string) => regex.test(s));

            result = entities[maskEntities[random(maskEntities.length - 1)]];
        } else {
            result = entities[value.substring(1)];
        }

        if (!result) {
            throw new Error(`Reference "${value}" not found`);
        }

        return result;
    }
}
