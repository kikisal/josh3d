
type PassFunc = () => void;

type Action = () => void;

type Misc = {
    key: string,
    action: (pass?: PassFunc) => Action
};

export function addMisc(key, cb) {
    miscActions.push({
        key,
        action: cb
    });
}

const ActionState = {
    create() {
        const state =  {
            skip: false,
            pass: () => {
                state.skip = true;
            }
        }

        return state;
    }
}

export function runMiscs() {
    
    for (const m of miscActions) {
        const state = ActionState.create();
        const act = m.action(state.pass);
        if (state.skip)
            continue;

        console.log("Running: ", m.key);

        act();
    }
}

const miscActions: Misc[] = [];

