export default function NuAddsReducer(NuAdds, action) {
    //Dumb workaround required to receive NULL from an API for a controlled field.
    const transformForState = (dataArray) => {
        dataArray.forEach((datum) => {
            if (datum.maxGramsPerLiterOverride == null) {
                datum.maxGramsPerLiterOverride = '';
            }
            if (datum.yanPpmPerGramOverride == null) {
                datum.yanPpmPerGramOverride = '';
            }
        });
        return dataArray;
    }

    switch (action.type) {
        case 'loaded': {
            const transformedData = transformForState(action.data);
            return [...transformedData];
        }
        case 'reloaded': {
            return [...NuAdds, {
                ...action.data ?? ''
            }]
        }
        case 'created': {
            const transformedData = transformForState([action.data])[0];
            console.log(transformedData);
            return [...NuAdds, {
                ...transformedData
            }]
        }
        case 'updated': {
            const transformedData = transformForState([action.data])[0];
            return NuAdds.map(n => {
                if (n.id == action.data.id) {
                    return action.data;
                }
                else {
                    return n;
                }
            });
        }
        case 'deleted': {
            return NuAdds.filter(n => n.id !== action.data.id)
        }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}