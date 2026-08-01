let selectedFeelings = [];


/* 気持ちを複数選択 */
function toggleFeeling(button){
  const feeling =
    button.dataset.feeling;

  if(
    selectedFeelings.includes(feeling)
  ){
    selectedFeelings =
      selectedFeelings.filter(
        item => item !== feeling
      );

    button.classList.remove(
      "selected"
    );
  }else{
    selectedFeelings.push(
      feeling
    );

    button.classList.add(
      "selected"
    );
  }
}


/* 入力内容を取得 */
function getValue(id){
  return document
    .getElementById(id)
    .value
    .trim();
}


/* チャッピーGPTへ送る文章をコピー */
function copyForChappy(){
  const currentConcern =
    getValue("currentConcern");

  const pastMemory =
    getValue("pastMemory");

  const otherFeeling =
    getValue("otherFeeling");

  const wantedAction =
    getValue("wantedAction");

  const wantedWords =
    getValue("wantedWords");

  const messageToPast =
    getValue("messageToPast");

  const gentleAction =
    getValue("gentleAction");

  const allFeelings = [
    ...selectedFeelings
  ];

  if(otherFeeling){
    allFeelings.push(
      otherFeeling
    );
  }

  if(
    !currentConcern &&
    !pastMemory &&
    allFeelings.length === 0 &&
    !wantedAction &&
    !wantedWords &&
    !messageToPast &&
    !gentleAction
  ){
    alert(
      "心に浮かんだことを、ひとつだけでも書いてみてね😊"
    );

    return;
  }

  let text = "";

  text +=
    "あの頃の私に「大丈夫だよ」と会いに行くワークをやってみたよ🌿\n\n";

  text +=
    "【今、心に引っかかっていること】\n";

  text +=
    `${currentConcern || "まだよくわからない"}\n\n`;

  text +=
    "【似たような気持ちを感じた過去の出来事】\n";

  text +=
    `${pastMemory || "まだ思い出せない"}\n\n`;

  text +=
    "【あの頃の私の気持ち】\n";

  text +=
    `${
      allFeelings.length > 0
        ? allFeelings.join("・")
        : "まだよくわからない"
    }\n\n`;

  text +=
    "【本当は何をしてほしかった？】\n";

  text +=
    `${wantedAction || "まだよくわからない"}\n\n`;

  text +=
    "【本当はどんな言葉を聞きたかった？】\n";

  text +=
    `${wantedWords || "まだよくわからない"}\n\n`;

  text +=
    "【今の私から、あの頃の私へ伝えたい言葉】\n";

  text +=
    `${messageToPast || "大丈夫だよ。よく頑張ったね。"}\n\n`;

  text +=
    "【今の私にしてあげたい、やさしいこと】\n";

  text +=
    `${gentleAction || "まだよくわからない"}\n\n`;

  text +=
    "誰かを責めたり、原因を決めつけたりするのではなく、あの頃の私が感じていたことや、本当はしてほしかったことをやさしく受け止めてください😊\n\n";

  text +=
    "今の私が、あの頃の私に安心して寄り添えるように、決めつけず、やさしく短く話してください🌈";

  copyText(
    text.trim()
  );
}


/* 文章をコピー */
function copyText(text){
  if(
    navigator.clipboard &&
    window.isSecureContext
  ){
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(
          "チャッピーGPTへ送る文章をコピーしたよ🐾"
        );
      })
      .catch(() => {
        fallbackCopy(text);
      });

    return;
  }

  fallbackCopy(text);
}


/* 通常のコピーができないとき */
function fallbackCopy(text){
  const temp =
    document.createElement(
      "textarea"
    );

  temp.value = text;

  temp.style.position =
    "fixed";

  temp.style.left =
    "-9999px";

  temp.style.top =
    "0";

  temp.setAttribute(
    "readonly",
    ""
  );

  document.body.appendChild(
    temp
  );

  temp.focus();
  temp.select();

  try{
    const copied =
      document.execCommand(
        "copy"
      );

    if(!copied){
      throw new Error(
        "copy failed"
      );
    }

    alert(
      "チャッピーGPTへ送る文章をコピーしたよ🐾"
    );
  }catch(error){
    alert(
      "コピーできなかったよ。もう一度試してね🐾"
    );
  }finally{
    document.body.removeChild(
      temp
    );
  }
}


/* 書いた内容を全部消す */
function clearAll(){
  const hasInput =
    getValue("currentConcern") ||
    getValue("pastMemory") ||
    getValue("otherFeeling") ||
    getValue("wantedAction") ||
    getValue("wantedWords") ||
    getValue("messageToPast") ||
    getValue("gentleAction") ||
    selectedFeelings.length > 0;

  if(!hasInput){
    alert(
      "今は書いた内容がないよ😊"
    );

    return;
  }

  const result =
    confirm(
      "書いた内容を全部消しても大丈夫？"
    );

  if(!result){
    return;
  }

  [
    "currentConcern",
    "pastMemory",
    "otherFeeling",
    "wantedAction",
    "wantedWords",
    "messageToPast",
    "gentleAction"
  ].forEach(id => {
    const element =
      document.getElementById(id);

    if(element){
      element.value = "";
    }
  });

  selectedFeelings = [];

  document
    .querySelectorAll(
      ".feeling-btn"
    )
    .forEach(button => {
      button.classList.remove(
        "selected"
      );
    });

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}
