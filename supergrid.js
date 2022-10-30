(function($){
      
    $.fn.superGrid = function(options){
        $.fn.defaults = {
            theme:"bootstrap5",
            defaultMsg: "Nothing to show...",
            dataType:"local",
            data:"",
            stickyHeader: true,
            stickyCols: 0,
            scroller: false,
            scrollSpeed: 100,
            rowsPerPage: 20,
            colModel: [
                {
                name:"",
                label:"",
                colDataType:"plainText",
                formInputType:"text",
                hidden: false,
                }  
            ],
                       
        }
        var settings = $.extend($.fn.defaults, options);

        //Add classes to the table
        this.wrap("<div class='supergrid-container'></div>")
        this.addClass("supergrid table table-responsive table-bordered table-hover");
        if(settings.theme === 'bootstrap5'){
            var tbody_classes = "supergrid-body";
            var thead_classes = "supergrid-header";
        }
        
        //Table Header
        function createTableHeader(){
            var headColNames = settings.colModel;
            let cols = '<tr>';
            headColNames.forEach((column, ind)=>{
                if(column.width !== undefined){
                    var colWidth = column.width;
                }

                //Load data based on display property
                if(column.hidden === true){
                    return;
                }
                else{
                    if(column.resizable){
                        cols += "<th style='min-width:"+colWidth+"px;'><div class='resizable'>" + column.label + "</div></th>";
                    }else{
                        cols += "<th style='min-width:"+colWidth+"px;'>"+ column.label + "</th>";
                    }
                }
                return cols;
            })
            let returnable = "<thead class="+thead_classes+">" + cols + "</thead>";
            return returnable;
        }
        let thead = createTableHeader();
        
        //Table Body
        function pagerControl(){
            var rowsPerPage = settings.rowsPerPage;
            var totalNoOfPages = Math.ceil(settings.data.length/rowsPerPage);
            var firstRow = 0;
            var lastRow = rowsPerPage;

            $(".supergrid-container").on("click", "#control-backward", function(){
                console.log("Hello")
            })

            return {
                fRow:firstRow,
                lRow:lastRow
            }
        }
        var pagerControlObj = pagerControl();

        function createSuperGridBody(){
            var bodyData = settings.data;
            var bodyDataType = settings.dataType;
            var bodyColModel = settings.colModel;
            var returnable="";
            bodyData.slice(pagerControlObj.fRow, pagerControlObj.lRow).forEach((item, ind)=>{
                
                var row='<tr>';
                bodyColModel.forEach((item1, ind1)=>{
                    
                    if(item1.hidden === true)
                    {
                        return;
                    }else if(item1.colDataType === undefined){
                        row= row+ '<td>' + item[item1.name] + '</td>';
                    }else if(item1.colDataType !== undefined){
                        /*Displaying data based on dataType */
                        //plainText
                        if(item1.colDataType === "plainText"){
                                row= row+ '<td>' + item[item1.name] + '</td>';
                        }
                        if(item1.colDataType === "number"){
                                row= row+ '<td>' + parseInt(item[item1.name]) + '</td>';
                        }
                        //Form type
                        else if(item1.colDataType === "form"){
                            //input type text
                            if(item1.formInputType === 'text'){
                                if(item[item1.name] !== undefined){
                                    row= row+ '<td><input type="text" value="' + item[item1.name] + '"></input></td>';
                                } else{
                                    row= row+ '<td><input type="text" value=""></input></td>';

                                }
                                
                            }
                            else if(item1.formInputType === 'textarea'){
                                if(item[item1.name] !== undefined){
                                    row= row+ '<td><textarea >'+ item[item1.name] +'</textarea></td>';
                                } else{
                                    row= row+ '<td><textarea></textarea></td>';

                                }
                                
                            }
                            else if(item1.formInputType === 'password'){
                                if(item[item1.name] !== undefined){
                                    row= row+ '<td><input type="password" value="' + item[item1.name] + '"></input></td>';
                                } else{
                                    row= row+ '<td><input type="password" value=""></input></td>';

                                }
                                
                            }
                            else if(item1.formInputType === 'radio'){
                                if(item[item1.name] !== undefined){
                                    row= row+ '<td><input type="radio" value="' + item[item1.name] + '" name="'+item[item1.name]+'></input></td>';
                                } else{
                                    row= row+ '<td><input type="radio" value=""></input></td>';
                                }
                                
                            }
                            else if(item1.formInputType === 'checkbox'){
                                if(item[item1.name] !== undefined){
                                    row= row+ '<td><input type="checkbox" value="' + item[item1.name] + '></input></td>';
                                } else{
                                    row= row+ '<td><input type="checkbox" value=""></input></td>';
                                }
                            }
                            else if(item1.formInputType === 'time'){
                                if(item[item1.name] !== undefined){
                                    row= row+ '<td><input type="time" value="' + item[item1.name] + '"></input></td>';
                                } else{
                                    row= row+ '<td><input type="time" value=""></input></td>';
                                }
                            }
                            else if(item1.formInputType === 'date'){
                                if(item[item1.name] !== undefined){
                                    row= row+ '<td><input type="date" value="' + item[item1.name] + '"></input></td>';
                                } else{
                                    row= row+ '<td><input type="date" value=""></input></td>';
                                }
                            }
                            else if(item1.formInputType == 'select'){
                                if(item1.selectOptions !== undefined){
                                    var listOfOptions = '';
                                    listOfOptions = item1.selectOptions.reduce((options, option, ind)=>{
                                    return  options + "<option>"+option+"</option>";
                                    })
                                    
                                }

                                row = row + "<td><select><option>Select</option>";
                                row = row + "<option>" + listOfOptions + "</option>";
                                row = row + "</select></td>";
                                //console.log(row)

                            }
                        }
                    }
                    
                })
                row = row + '</tr>';
                returnable = returnable + row;
            })
            
            return returnable;
            
        }
        var tbody = createSuperGridBody();

        
        var finalTable = thead + tbody;
        this.append(finalTable); //Appended the table content to the table
        
        //Post Data Modifications
        //Adding class to tbody
        $(this).find("tbody").addClass("supergrid-body");

        //Making the thead sticky
        if(settings.stickyHeader){
            $(this).find("thead").addClass("sticky-header");
            $(this).parent(".supergrid-container").addClass("supergrid-sticky-header-container");
        }

        //Making Columns sticky
        if(settings.stickyCols !== undefined && settings.stickyCols >0){
            let stickyColCount = settings.stickyCols;
            let i = 0;
            let positionLeft = 0;
            while(i<stickyColCount){
                //thead part
                $(this).find(`.supergrid-header tr th:nth-child(${i+1})`).addClass("supergrid-sticky-columns");
                $(this).find(`.supergrid-header tr th:nth-child(${i+1})`).css({"left": positionLeft, "background-color":"#87CEEB"});

                //tbody part
                $(this).find(`.supergrid-body tr td:nth-child(${i+1})`).addClass("supergrid-sticky-columns");

                $(this).find(`.supergrid-body tr td:nth-child(${i+1})`).css("left", positionLeft);
                positionLeft += parseFloat($(this).find(`.supergrid-body tr td:nth-child(${i+1})`).css('width')) + parseFloat($(this).find(`.supergrid-body tr td:nth-child(${i+1})`).css('border-left-width'));
                i++;
            }
            //Add thicker border-right to the last frozen column
            $(this).find(`.supergrid-body tr .supergrid-sticky-columns:nth-child( ${stickyColCount})`).css("box-shadow","5px 0 5px 5px grey");

        }

        
        //Scroller
        
        if(settings.scroller){
            var speed = 0;
                        
            let scroller = "<div class='supergrid-scroller'>" 
                        +"<div class='btn-group' role='group' aria-label='Scroller'>"
                            +`<button type='button' class='btn scroll-left'><i class="fa-solid fa-chevron-left"></i></button>`
                            +`<button type='button' class='btn scroll-right'><i class="fa-solid fa-chevron-right"></i></button>`
                        +"</div>"
                    +"</div>"
            $(scroller).insertBefore($(this));

            let scrollLeftBtn = $(".scroll-left");
            let scrollRightBtn = $(".supergrid-scroller .scroll-right");

            scrollLeftBtn.click(function(){
                $(".supergrid-container")[0].scrollLeft -=settings.scrollSpeed;
            })

            scrollRightBtn.click(function(){
                $(".supergrid-container")[0].scrollLeft +=settings.scrollSpeed;
            })

            if(settings.stickyCols > 0){
                let i =0;
                let spaceFromLeft = 0;
                while(i < settings.stickyCols){
                    let width = $(this).find(`.supergrid-body  tr .supergrid-sticky-columns:nth-child(${i+1})`).css("width");
                    spaceFromLeft += parseFloat(width);
                    i++;
                }
                spaceFromLeft = spaceFromLeft - 20;
               
                $(".supergrid-scroller").css(
                    {
                        "top":"120px",
                        "transform": `translateX(${spaceFromLeft}px)`
                    }
                );
            }
            else{
                let width = $(this).find(".supergrid-body  tr td:nth-child(1)").width();
                console.log(width)
                $(".supergrid-scroller").css(
                    {
                        "top":"0px",
                        "transform": `translateX(${width}px)`,
                        "height":"auto"
                    }
                );
            }


        }


        //SuperGrid Pager

        $(`<div class="supergrid-pager">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-4 pager-left">
                        <div class="left-container">
                            
                        </div>
                    </div>
                    <div class="col-sm-4 pager-controls">
                        <div class="controls-container">
                            <div class="btn-group" role="group" aria-label="pager-controls">
                                <button type="button" id="control-backward-fast" class="btn "><i class="fa-solid fa-backward-fast"></i></button>
                                <button type="button" id="control-backward" class="btn "><i class="fa-solid fa-backward"></i></button>
                                <div class="d-inline-block controls-couter"><span>Page <input class="pager-counter" type="text" value="1"/> of 1 </span></div>
                                <button type="button" id="control-forward" class="btn "><i class="fa-solid fa-forward"></i></button>
                                <button type="button" id="control-forward-fast" class="btn "><i class="fa-solid fa-forward-fast"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4 pager-right">
                        <div class="right-container">
                            View <span>1</span> - <span>13</span> of <span>13</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>`).insertAfter($(this));


      
    }//End of plugin function

}(jQuery));





