export default function LogEntriesReducer(LogEntries, action) {
    //Dumb workaround required to receive NULL from an API for a controlled field.
    const transformForState = (dataArray) => {
        dataArray.forEach((datum) => {
            if (datum.specificGravityReading == null) {
                datum.specificGravityReading = '';
            }
            if (datum.pHReading == null) {
                datum.pHReading = '';
            }
        }); 
        return dataArray;
    }

    switch (action.type) {
        case 'loaded': {
            const transformedData = transformForState(action.data);
            return [...action.data];
        }
        case 'created': {
            transformForState([action.data]);
            return [{...action.data},  ...LogEntries  ];
        }
        case 'updated': {
            transformForState([action.data])
            return LogEntries.map(le => {
                if (le.id == action.data.id) {
                    return action.data;
                }
                else {
                    return le;
                }
            });
        }
        case 'deleted': {
            return LogEntries.filter(le => le.id !== action.data.id)
        }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}