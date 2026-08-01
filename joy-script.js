let selectedFeelings = [];
let timerId = null;


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


/* 10秒間、喜びを味わう */
function startTaste(){
  const tasteButton =
    document.getElementById(
      "tasteButton"
    );

  const timerText =
    document.getElementById(
      "timerText"
    );

  const finishBox =
    document.getElementById(
      "finishBox"
    );

  if(timerId){
    clearInterval(timerId);
    timerId = null;
  }

  let seconds = 10;

  finishBox.classList.add(
    "hidden"
  );

  tasteButton.disabled = true;
  tasteButton.textContent =
    "ゆっくり味わってね😊";

  timerText.textContent =
    `${seconds}秒`;

  timerId = setInterval(() => {
    seconds -= 1;

    if(seconds > 0){
      timerText.textContent =
        `${seconds}秒`;

      return;
    }

    clearInterval(timerId);
    timerId = null;

    timerText.textContent =
      "花まる😊";

    tasteButton.disabled = false;
    tasteButton.textContent =
      "🌈 もう一度味わってみる";

    finishBox.classList.remove(
      "hidden"
    );

    finishBox.scrollIntoView({
      behavior:"smooth",
      block:"center"
    });
  }, 1000);
}


/* チャッピーGPTへ送る文章をコピー */
function copyForChappy(){
  const happyMemory =
    getValue("happyMemory");

  const wish =
    getValue("wishText");

  const place =
    getValue("placeText");

  const withWho =
    getValue("withText");

  const words =
    getValue("wordsText");

  const otherFeeling =
    getValue("otherFeeling");

  const allFeelings = [
    ...selectedFeelings
  ];

  if(otherFeeling){
    allFeelings.push(
      otherFeeling
    );
  }

  if(
    !happyMemory &&
    !wish &&
    !place &&
    !withWho &&
    !words &&
    allFeelings.length === 0
  ){
    alert(
      "心に浮かんだことを、ひとつだけでも書いてみてね😊"
    );

    return;
  }

  let text = "";

  text +=
    "喜びを先に味わうワークをやってみたよ🌈\n\n";

  text +=
    "【今までで、しあわせだと感じたこと】\n";

  text +=
    `${happyMemory || "まだ思いつかない"}\n\n`;

  text +=
    "【叶ったらうれしい願い】\n";

  text +=
    `${wish || "まだよくわからない"}\n\n`;

  text +=
    "【願いが叶った私は、どこにいる？】\n";

  text +=
    `${place || "まだ思いつかない"}\n\n`;

  text +=
    "【誰と一緒にいる？】\n";

  text +=
    `${withWho || "まだ思いつかない"}\n\n`;

  text +=
    "【どんな顔で、何と言っている？】\n";

  text +=
    `${words || "まだ思いつかない"}\n\n`;

  text +=
    "【そのとき感じている気持ち】\n";

  text +=
    `${
      allFeelings.length > 0
        ? allFeelings.join("・")
        : "まだよくわからない"
    }\n\n`;

  text +=
    "この喜びを少し先に味わってみたよ😊\n\n";

  text +=
    "分析したり、願いが叶うと決めつけたりせず、今感じられた喜びや安心を一緒に味わいながら、やさしく短く話してください🌿";

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
    getValue("happyMemory") ||
    getValue("wishText") ||
    getValue("placeText") ||
    getValue("withText") ||
    getValue("wordsText") ||
    getValue("otherFeeling") ||
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

  if(timerId){
    clearInterval(timerId);
    timerId = null;
  }

  [
    "happyMemory",
    "wishText",
    "placeText",
    "withText",
    "wordsText",
    "otherFeeling"
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

  document
    .getElementById(
      "finishBox"
    )
    .classList
    .add("hidden");

  document
    .getElementById(
      "timerText"
    )
    .textContent = "10秒";

  const tasteButton =
    document.getElementById(
      "tasteButton"
    );

  tasteButton.disabled = false;
  tasteButton.textContent =
    "🌈 喜びを先に味わってみる";

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}
