//长按删除
	mui('.revene_all').on('longtap', 'li', function(e) {
		$('.revene_all').find('#middlePopover').remove();
		$(this).append(
			'<div id="middlePopover" class="mui-popover"><button type="button" class="mui-btn mui-btn-blue mui-btn-outlined delete_this_btn">删除</button></div>'
		);
		$('#middlePopover').show()
	})