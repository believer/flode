module Primary = {
  [@react.component]
  let make = (~children, ~type_="button") => {
    <button
      className="w-full text-white rounded py-3 bg-blue-600
      focus:bg-blue-500 hover:bg-blue-500"
      type_>
      children
    </button>;
  };
};
