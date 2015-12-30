const initialState = {
  expression: 'x^3 - 3x^2 + 3^x -1'
};

const COMPUTE = "compute";

export default function update(state = initialState, action = {}) {
  if(action.type === COMPUTE) {
    console.log(action.expression);

    return state;
  }
}
