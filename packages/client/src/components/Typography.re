module H1 = {
  [@react.component]
  let make = (~children) => {
    let {theme}: Theme.Context.t = Theme.Context.use();

    <h1
      className={Cn.make([
        "text-5xl font-semibold leading-tight",
        switch (theme) {
        | Light => "text-gray-800"
        | Dark => "text-gray-300"
        },
      ])}>
      children
    </h1>;
  };
};
