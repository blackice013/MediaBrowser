(function ($, document, LibraryBrowser) {

    function reload(page) {

        var id = getParameterByName('id');

        Dashboard.showLoadingMsg();

        ApiClient.getItem(Dashboard.getCurrentUserId(), id).done(function (item) {

            var name = item.Name;

            $('#itemImage', page).html(LibraryBrowser.getDetailImageHtml(item));

            Dashboard.setPageTitle(name);

            $('#itemName', page).html(name);

            renderDetails(page, item);

            Dashboard.hideLoadingMsg();
        });
    }

    function renderDetails(page, item) {
        
        if (item.Taglines && item.Taglines.length) {
            $('#itemTagline', page).html(item.Taglines[0]).show();
        } else {
            $('#itemTagline', page).hide();
        }

        if (item.Overview || item.OverviewHtml) {
            var overview = item.OverviewHtml || item.Overview;

            $('#itemOverview', page).html(overview).show();
            $('#itemOverview a').each(function () {
                $(this).attr("target", "_blank");
            });
        } else {
            $('#itemOverview', page).hide();
        }

        if (item.CommunityRating) {
            $('#itemCommunityRating', page).html(LibraryBrowser.getStarRatingHtml(item)).show().attr('title', item.CommunityRating);
        } else {
            $('#itemCommunityRating', page).hide();
        }

        $('#itemMiscInfo', page).html(LibraryBrowser.getMiscInfoHtml(item));

        LibraryBrowser.renderGenres($('#itemGenres', page), item);
        LibraryBrowser.renderStudios($('#itemStudios', page), item);
        renderUserDataIcons(page, item);
        LibraryBrowser.renderLinks($('#itemLinks', page), item);
    }
    
    function renderUserDataIcons(page, item) {
        $('#itemRatings', page).html(LibraryBrowser.getUserDataIconsHtml(item));
    }
    
    function renderSeasons(page) {
        
        ApiClient.getItems(Dashboard.getCurrentUserId(), {
            
            ParentId: getParameterByName('id'),
            SortBy: "SortName"
            
        }).done(function(result) {
            
            var html = LibraryBrowser.getPosterDetailViewHtml({
                items: result.Items,
                useAverageAspectRatio: true
            });


            $('#seasonsContent', page).html(html);
        });
    }

    $(document).on('pageshow', "#tvSeriesPage", function () {

        var page = this;
        
        reload(page);

        $('#seasonsCollapsible', page).on('expand.lazyload', function () {

            renderSeasons(page);

            $(this).off('expand.lazyload');
        });
        
    }).on('pagehide', "#tvSeriesPage", function () {

        var page = this;

        $('#seasonsCollapsible', page).off('expand.lazyload');
    });


})(jQuery, document, LibraryBrowser);