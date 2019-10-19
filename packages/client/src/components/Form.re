module Label = {
  [@react.component]
  let make = (~name as htmlFor, ~children) => {
    <label className="block font-semibold text-sm text-gray-500 mb-1" htmlFor>
      children
    </label>;
  };
};

module Input = {
  [@react.component]
  let make =
      (
        ~className=?,
        ~error: option(Belt.Result.t(Formality.ok, string)),
        ~label,
        ~name,
        ~onChange,
        ~placeholder="",
        ~type_="text",
        ~value,
      ) => {
    <div className={className->Cn.unpack}>
      <Label name> {React.string(label)} </Label>
      <input
        className="w-full pb-2 text-base bg-transparent border-0 border-b-2
        border-gray-300 focus:border-gray-500"
        id=name
        onChange
        placeholder
        type_
        value
      />
      {switch (error) {
       | Some(Error(message)) =>
         <div className="text-guardsman-red mt-2"> message->React.string </div>
       | Some(Ok(Valid))
       | Some(Ok(NoValue))
       | None => React.null
       }}
    </div>;
  };
};
