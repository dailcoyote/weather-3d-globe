import Geodata from "./city.list.json";

class Dictionary {
    constructor() {
        this._dictionaryMap = new Map();
        this.createABCIndexDictionary();
    }
    createABCIndexDictionary() {
        geoloop:
        for (let index = 0; index < Geodata.length; index++) {
            let record,
                abcIndexVector,
                abcSize,
                dictionaryKey;
            record = Geodata[index];
            dictionaryKey = record.name.charAt(0);

            if (!this._dictionaryMap.has(dictionaryKey)) {
                this._dictionaryMap.set(dictionaryKey, [record]);
                continue geoloop;
            }

            abcIndexVector = this._dictionaryMap.get(dictionaryKey);
            abcSize = abcIndexVector.length;
            let temp = abcIndexVector[abcSize - 1];
            if (record.name < temp.name) {
                abcIndexVector[abcSize - 1] = { ...record };
                abcIndexVector.push(temp);
            } else {
                abcIndexVector.push(record);
            }

            this._dictionaryMap.set(dictionaryKey, abcIndexVector);
        }
    }

    getEntry(params) {
        const [city, country] = params.split(','),
            dictionaryKey = params?.charAt(0),
            abcIndexVector = this._dictionaryMap.get(dictionaryKey) || [];

        for (let index = 0; index < abcIndexVector.length; index++) {
            let entry = abcIndexVector[index];

            if (
                entry.name.toLowerCase().includes(city?.toLowerCase()) &&
                entry.country.toLowerCase().includes(country?.toLowerCase())
            ) {
                return entry;
            }
        }
        return undefined;
    }

    getSuggestions(searchTerm = "", limitRecords = 10) {
        const dictionaryKey = searchTerm.charAt(0);
        const abcIndexVector = this._dictionaryMap.get(dictionaryKey) || [];
        let matches = 0;
        let loopIndx = 0;
        let suggestions = [];

        suggestionLoop:
        while (matches < limitRecords) {
            if (!abcIndexVector[loopIndx]) {
                break suggestionLoop;
            }
            const { id, coord, name, country } = abcIndexVector[loopIndx];

            if (
                name.substr(0, searchTerm.length) === searchTerm
            ) {
                matches++;
                suggestions.push({
                    id, coord, name, country
                });
            }
            loopIndx++;
        }

        return suggestions;
    }
}

class GeoRadar {
    constructor() {
        this._dictionary = new Dictionary();
    }
    search() {
        return this._dictionary.getSuggestions.apply(this._dictionary, arguments);
    }
}

export default new GeoRadar();