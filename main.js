let chart_json_obj = [{"id":'0',"value":75},{"id":'1',"value":20}];
const $yAxisMax = document.querySelector("#chart-inner-y-axis-max");
const $xAxisContext = document.querySelector("#chart-inner-x-axis");
const $chartInnerLayer = document.querySelector("#chart-inner-layer");
const $idInput = document.querySelector("#value-add-id-input");
const $valueInput = document.querySelector("#value-add-value-input");
const $innerEditTbody = document.querySelector("#value-edit-inner-table-body");
const $addBtn = document.querySelector("#value-add-func-btn");
const $addGroup = document.querySelector("#value-add-func-group");
const $proTextarea = document.querySelector("#value-pro-edit-textarea");



    $idInput.addEventListener('keydown',e=>{
        isValidNum(e);
    });
    $idInput.addEventListener('keyup',function(e){
        isValidId(e);
    })
    $valueInput.addEventListener('keydown',e=>{
        isValidNum(e);
    });
    $valueInput.addEventListener('keyup',function(e){
        ableBtn(e);
    })
    $addBtn.addEventListener('click',function(e){
        addFunc(e);
        reset_chart()
    })
    
    reset_chart();

    
    function reset_chart(){
        $chartInnerLayer.innerHTML='';
        $xAxisContext.innerHTML='';
        $innerEditTbody.innerHTML='';
        if(chart_json_obj.length>0){
        // 최대값 도출
        let max_val = [...chart_json_obj].sort((a,b)=>b["value"]-a["value"])[0];
        // ID 오름차순 정렬
        chart_json_obj.sort((a,b)=>a["id"]-b["id"]);
        // 차트 y측 맥스값 기입
        $yAxisMax.textContent = max_val["value"]===0?"":max_val["value"];
   
        /* 데이터 변수 */
        chart_json_obj.map(el=>{
            /* bar 차트 그리기 */
            let div=document.createElement("div");
            div.classList.add("chart_bar");
            /* 바 차트 높이 요소값/최대값 % */
            div.style.height=~~(el["value"]/max_val.value*100)+"%";
            /* 바 차트 넓이 10% 별도로 css에서 max-width 지정 */
            div.style.width="10%";
            div.style.backgroundColor='#ddd';
            /* 바 차트 hover할 경우 데이터 노출을 위한 dataset */
            div.dataset.value = `id : ${el.id}\n값 : ${el.value}`;
            $chartInnerLayer.append(div);

            /* bar차트와 xAxis 동일한 위치 지정을 위해 동일한 정렬, 가로너비로 지정해서 요소 배치 */
            let h5 = document.createElement('h5');
            h5.textContent=el.id;
            $xAxisContext.append(h5);

            /* 테이블 데이터 정리 */
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            let btn = document.createElement('button');
            let input = document.createElement('input');
            /* id값 td에 대입해서 넣음 */
            td.textContent=el.id;
            tr.append(td);

            td = document.createElement('td');
            input.value=el.value;
            input.addEventListener('keydown',(e)=>isValidNum(e));
            td.append(input);
            tr.append(td);

            td = document.createElement('td');
            btn.textContent='삭제';
            btn.addEventListener('click',function(){remove_obj(event);});
            td.append(btn);
            tr.append(td);
            $innerEditTbody.append(tr);
            
        });
        $proTextarea.value=JSON.stringify(chart_json_obj).replaceAll("[","[\n\t").replaceAll("}","\n\t}").replaceAll("]","\n]").replaceAll("{","{\n\t").replaceAll(",",",\n\t");

        }else{
            /* bar chart의 노데이터 */
            $yAxisMax.textContent=0;
            $chartInnerLayer.textContent="No Data";

            /* 데이터 테이블의 노데이터 */
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.setAttribute('colspan',3);
            td.textContent='No Data';
            tr.append(td);
            $innerEditTbody.append(tr);
        }
    }


    function remove_obj(e){
        // chart_json_obj=chart_json_obj.filter(el=>el.id!=id); 바로 적용x => apply 버튼 클릭시 적용
        // 따로 reset btn 제공
        e.target.parentElement.parentElement.remove();
    }




function isValidNum(e){
    console.log(e);
    
    if(/\d/.test(e.key)||e.keyCode===8||e.keyCode===46){
      /*   if(chart_json_obj.find(el=>el.id==e.target.value+e.key)){
            중복값
        }; */
    }else{
        e.preventDefault();
    }
}

function checkform(e){
    event.preventDefault();
    let testForm = document.querySelector('#testForm');
    let formData = new FormData(testForm);
    console.log(testForm);
    console.log(formData);
    console.log([...formData.entries()]);
    console.log(this);
}

function isValidId(e){
    $addBtn.setAttribute('disabled',true);
    if(!!chart_json_obj.find(el=>el.id==e.target.value)){
        $addGroup.dataset.text='중복된 ID는 사용할 수 없습니다.';
    }else{
        $addGroup.dataset.text='';
        if(e.target.value?.length>0){
            $addGroup.dataset.text='사용가능한 id입니다.';
            if($valueInput.value?.length>0){
                $addBtn.removeAttribute('disabled');
            }
        }
    }
    if(e.key=='Tab'){
        $valueInput.focus();
    }
}

function ableBtn(e){
    $addBtn.setAttribute('disabled',true);
    if(e.target.value?.length>0&&$addGroup.dataset.text=='사용가능한 id입니다.'){
        $addBtn.removeAttribute('disabled');
    };
    if(e.key=='Tab'){
        $idInput.focus();
    }
}

function addFunc(e){
    chart_json_obj.push({id:String($idInput.value),value:$valueInput.value});
    $idInput.value='';
    $valueInput.value='';
    $addGroup.dataset.text='';
}

function tableApply(){
    chart_json_obj=[];
    [...$innerEditTbody.children].map(el=>{
        chart_json_obj.push({id:String(el.children[0].textContent),value:el.children[1].children[0].value});
    });
    reset_chart();
}

function proApply(e){
    console.log(e);
    console.log($proTextarea.value.replaceAll(JSON.stringify(chart_json_obj),''));
    try{
        chart_json_obj=JSON.parse($proTextarea.value);
        reset_chart();
    }catch{
        $proTextarea.backgroundColor='red';
        $proTextarea.parentElement.dataset.pro = "입력양식을 맞춰주세요.";
    }
    
}

function proEditKeydown(e){
 
}