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
            pager: true,
            rowsPerPage: 20,
            rowNumbering: true,
            multiSelect: false,
            colModel: [
                {
                name:"",
                label:"",
                colDataType:"plainText",
                formInputType:"text",
                width: "auto",
                hidden: false,
                formatter: function(){}
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
            if(settings.multiSelect){
                cols += '<th><input class="multiselect-check-all" type="checkbox"></input></th>';
            }
            if(settings.rowNumbering){
                cols += '<th></th>';
            }
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
        

        function createSuperGridBody(bodyData, bodyColModel, bodyDataType){
            
            var returnable="";
            bodyData.forEach((item, ind)=>{
                
                var row='<tr>';
                //Display row numbers in the first column
                if(settings.multiSelect){
                    row += '<td><input class="multiselect-check" type="checkbox"></input></td>';
                }
                if(settings.rowNumbering){
                    row = row + '<td>' + parseInt(ind+1) + '</td>';
                }
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
                                    row= row+ `<td><input type="radio" value=" ${item[item1.name]} " name="${item[item1.name]}_${ind}"></input></td>`;
                                } else{
                                    row= row+ '<td><input type="radio" value=""></input></td>';
                                }
                                
                            }
                            else if(item1.formInputType === 'checkbox'){
                                if(item[item1.name] !== undefined){
                                    row= row+ `<td><input type="checkbox" value=" ${item[item1.name]} "></input></td>`;
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

        
        var tbody = createSuperGridBody(settings.data, settings.colModel, settings.dataType);

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
            if(settings.rowNumbering){stickyColCount +=1}
            if(settings.multiSelect){stickyColCount +=1}
            let i = 0;
            let positionLeft = 0;
            while(i<stickyColCount){
                //thead part
                $(this).find(`.supergrid-header tr th:nth-child(${i+1})`).addClass("supergrid-sticky-columns");
                $(this).find(`.supergrid-header tr th:nth-child(${i+1})`).css({"left": positionLeft, "background-color":"#6495ED"});

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
                let stickyCols = settings.stickyCols;
                if(settings.rowNumbering){stickyCols+=1}
                if(settings.multiSelect){stickyCols+=1}

                let i =0;
                let spaceFromLeft = 0;
                let spaceFromTop = $(".supergrid-body tr:nth-child(1)").height() * 2 - 18;
                console.log("top" , spaceFromTop);
                while(i < stickyCols){
                    let width = $(this).find(`.supergrid-body  tr .supergrid-sticky-columns:nth-child(${i+1})`).css("width");
                    spaceFromLeft += parseFloat(width);
                    i++;
                }
                spaceFromLeft = spaceFromLeft - 20;
               
                $(".supergrid-scroller").css(
                    {
                        "top":spaceFromTop,
                        "transform": `translateX(${spaceFromLeft}px)`
                    }
                );
            }
            else{
                let width = $(this).find(".supergrid-body  tr td:nth-child(1)").width();
                //console.log(width)
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

        if (settings.pager) {

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
                                <button type="button" id="control-backward-fast" class="btn"><i class="fa-solid fa-backward-fast"></i></button>
                                <button type="button" id="control-backward" class="btn "><i class="fa-solid fa-backward"></i></button>
                                <div class="d-inline-block controls-couter"><span>Page <input class="pager-counter" id="page-num" type="text" value="1"/> of <span id="tot-page"></span> </span></div>
                                <button type="button" id="control-forward" class="btn " ><i class="fa-solid fa-forward"></i></button>
                                <button type="button" id="control-forward-fast" class="btn " ><i class="fa-solid fa-forward-fast"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4 pager-right">
                        <div class="right-container">
                            View <span id="startRowNum">1</span> - <span id="endRowNum">13</span> of <span id="totalRowNum">13</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>`).insertAfter($(this));

            //Pagination
            var startRow = 0;
            var numOfRows = settings.rowsPerPage;
            var lastRow = startRow + numOfRows;
            var currPage = 1;
            var totalPage = Math.ceil(settings.data.length / numOfRows);
            //console.log("Total Page",  totalPage);
            var noOfRowsIntheLastPage = 0;
                        

            $("#page-num").val(currPage);
            $("#tot-page").text(totalPage);

            $(`.supergrid-body tr`).slice(lastRow, settings.data.length).hide();
            $("#control-backward").attr("disabled", "disabled");
            $("#control-backward-fast").attr("disabled", "disabled");

            //Backward Fast
            $('.controls-container').on("click", "#control-backward-fast", function () {
            
                $(`.supergrid tr`).slice(startRow, parseInt(lastRow+1)).hide();

                if(currPage === 2){
                    currPage -= 1;
                }
                else{
                    //console.log(currPage);
                    currPage-=2;
                }
                $("#page-num").val(currPage);
                
                let count = settings.rowsPerPage * 2;
                startRow -= count;
                lastRow = startRow + settings.rowsPerPage;
                //console.log("fast back 2", startRow, lastRow);
                if (startRow <= 0 ) {
                    startRow = 0;
                    lastRow = settings.rowsPerPage;

                    $("#control-backward").attr("disabled", "disabled");
                    $("#control-backward-fast").attr("disabled", "disabled");

                }
                if ($("#control-forward").attr("disabled") !== undefined || $("#control-forward").attr("disabled") !== false) {
                    $("#control-forward").removeAttr("disabled");
                }
                if ($("#control-forward-fast").attr("disabled") !== undefined || $("#control-forward-fast").attr("disabled") !== false) {
                    $("#control-forward-fast").removeAttr("disabled");
                }
                //console.log("fast back 3", startRow, lastRow);
                
                $(`.supergrid-body tr`).slice(startRow, lastRow).show();

                //Update the pager right info
                $("#startRowNum").text(startRow);
                $("#endRowNum").text(lastRow);
            })

            //Backward
            $('.controls-container').on("click", "#control-backward", function () {
                
                $(`.supergrid-body tr`).slice(startRow, lastRow).hide();
                currPage= currPage -1;
                //console.log(currPage);
                $("#page-num").val(currPage);

                let count = -(settings.rowsPerPage);
                startRow += count;
                lastRow += count;

                if (startRow <= 0) {
                    startRow = 0;
                    lastRow = startRow + Math.abs(count);
                    
                    $("#control-backward").attr("disabled", "disabled");
                    $("#control-backward-fast").attr("disabled", "disabled");

                }
                if ($("#control-forward").attr("disabled") !== undefined || $("#control-forward").attr("disabled") !== false) {
                    $("#control-forward").removeAttr("disabled");
                }
                if ($("#control-forward-fast").attr("disabled") !== undefined || $("#control-forward-fast").attr("disabled") !== false) {
                    $("#control-forward-fast").removeAttr("disabled");
                }
                
                $(`.supergrid-body tr`).slice(startRow, lastRow).show();

                //Update the pager right info
                $("#startRowNum").text(startRow);
                $("#endRowNum").text(lastRow);
            })

            //Forward
            $('.controls-container').on("click", "#control-forward", function () {
                //console.log("Forward 1", startRow, lastRow);
                if (lastRow >= settings.data.length){
                    $("#control-backward").attr("disabled", "disabled");
                    $("#control-backward-fast").attr("disabled", "disabled");
                }else{
                    $(`.supergrid-body tr`).slice(startRow, lastRow).hide();
                }
                currPage= currPage + 1;
                console.log(currPage);
                $("#page-num").val(currPage);

                let count = settings.rowsPerPage;
                startRow += count;
                lastRow += count;
                //console.log("Forward 2", startRow, lastRow);
                if(settings.data.length % numOfRows !== 0){
                    noOfRowsIntheLastPage = settings.data.length % numOfRows;
                }else{
                    noOfRowsIntheLastPage = count;
                }
                

                if (lastRow >= settings.data.length) {
                    lastRow = settings.data.length;
                    startRow = lastRow - noOfRowsIntheLastPage;
                    //console.log("Forward 3", startRow, lastRow);
                    $("#control-forward").attr("disabled", "disabled");
                    $("#control-forward-fast").attr("disabled", "disabled");

                }
                if ($("#control-backward").attr("disabled") !== undefined || $("#control-backward").attr("disabled") !== false) {
                    $("#control-backward").removeAttr("disabled");
                }
                if ($("#control-backward-fast").attr("disabled") !== undefined || $("#control-backward-fast").attr("disabled") !== false) {
                    $("#control-backward-fast").removeAttr("disabled");
                }
                $(`.supergrid-body tr`).slice(startRow, lastRow).show();//css("display","block");
                //console.log("Forward 4", startRow, lastRow);

                //Update the pager right info
                
                $("#startRowNum").text(startRow);
                $("#endRowNum").text(lastRow);
            })

            //Forward Fast
            $('.controls-container').on("click", "#control-forward-fast", function () {
                // if (lastRow >= settings.data.length){
                //     return;
                // }else{
                    $(`.supergrid-body tr`).slice(startRow, lastRow).hide();
                // }
                
                if(totalPage%2 === 0){
                    if(totalPage - currPage === 1){
                        currPage +=1;
                    }else{
                        currPage +=2;
                    }
                }else{
                    currPage= currPage + 2;
                }
                if(currPage > totalPage){
                    return;
                }else{
                    //console.log(currPage);
                    $("#page-num").val(currPage);
                }
                

                let count = settings.rowsPerPage * 2;
                
                lastRow += count;
                startRow = lastRow - settings.rowsPerPage;
                if(settings.data.length % numOfRows*2 !== 0){
                    noOfRowsIntheLastPage = settings.data.length % numOfRows*2;
                }else{
                    noOfRowsIntheLastPage = settings.rowsPerPage;
                }
                

                if (lastRow >= settings.data.length) {
                    lastRow = settings.data.length;
                    startRow = lastRow - noOfRowsIntheLastPage;

                    $("#control-forward-fast").attr("disabled", "disabled");
                    $("#control-forward").attr("disabled", "disabled");

                }
                if ($("#control-backward").attr("disabled") !== undefined || $("#control-backward").attr("disabled") !== false) {
                    $("#control-backward").removeAttr("disabled");
                }
                if ($("#control-backward-fast").attr("disabled") !== undefined || $("#control-backward-fast").attr("disabled") !== false) {
                    $("#control-backward-fast").removeAttr("disabled");
                }
                $(`.supergrid-body tr`).slice(startRow, lastRow).show();//css("display","block");


                //Update the pager right info
                
                $("#startRowNum").text(startRow);
                $("#endRowNum").text(lastRow);
            })

            //Display the pager right info onLoad
            $("#totalRowNum").text(settings.data.length);
            $("#startRowNum").text(startRow);
            $("#endRowNum").text(lastRow);
        }
        //End of Pager


        //Row Multiselct Functionality
        if(settings.multiSelect){
            $(this).on("click", ".supergrid-body tr", function(event){
                event.stopPropagation();
                let row = $(this).find(".multiselect-check");
                if(row.prop("checked")){
                    row.prop("checked", false)
                    $(this).removeClass("selected-row");
                }else{
                    row.prop("checked", true);
                    $(this).addClass("selected-row")
                }
            })

            $(this).on("click", ".supergrid-body tr input, .supergrid-body tr select, .supergrid-body tr textarea ", function(event){
                event.stopPropagation();
            })

            //select all rows
            $(this).on("click", ".supergrid-header .multiselect-check-all", function(event){
                event.stopPropagation();
                let rows = $(".supergrid-body tr");
                if($(this).prop("checked")){
                    [rows].forEach((item)=>{
                        item.find(".multiselect-check").prop("checked", true);
                    })
                }
                else{
                    [rows].forEach((item)=>{
                        item.find(".multiselect-check").prop("checked", false);
                    })
                }
                
                
            })
        }
        

        
      
    }//End of plugin function

}(jQuery));






