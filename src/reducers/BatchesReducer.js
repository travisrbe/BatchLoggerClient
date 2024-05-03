export default function BatchesReducer(Batches, action) {

    switch (action.type) {
        case 'loaded': {
            return [...action.data];
        }
        case 'created': {
            return [{ ...action.data }, ...Batches];
        }
        case 'updated': {
            //transformForState([action.data])
            return Batches.map(b => {
                if (b.id == action.data.id) {
                    return action.data;
                }
                else {
                    return b;
                }
            });
        }
        case 'deleted': {
            return Batches.filter(b => b.id !== action.data.id)
        }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}