type Action =
  | { type: "LOADING" }
  | { type: "SET_DATA", payload: any[] };

interface DropDownState
{
  isLoading: boolean;
  data: any[];
}

export function dropDownStateReducer(
  state: DropDownState,
  action: Action)
  : DropDownState
{
  switch (action.type)
  {
    case "LOADING":
      return { ...state, isLoading: true };

    case "SET_DATA":
      return (
      {
        isLoading: false,
        data: action.payload
      });
  }
};