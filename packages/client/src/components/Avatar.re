[@bs.module] external md5: string => string = "md5";

[@react.component]
let make = (~email) => {
  let hash = md5(email);
  let src = {j|https://www.gravatar.com/avatar/$hash?s=300|j};

  <img className="w-8 h-8 rounded-full" src alt="" />;
};
