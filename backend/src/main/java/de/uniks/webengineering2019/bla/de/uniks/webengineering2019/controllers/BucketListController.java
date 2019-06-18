package de.uniks.webengineering2019.bla.de.uniks.webengineering2019.controllers;

import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model.BucketList;
import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model.BucketListEntry;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@CrossOrigin
@RequestMapping("/bucketlists/**")
@RestController
public class BucketListController{

    @GetMapping("/all")
    public List<BucketList> getAllLists(){
        List<BucketList> list = new ArrayList<>();
        for(int i=0;i<10;i++){
            BucketList it = BucketList.builder().title("Testliste "+i).createnDate(new Date()).lastUpdated(new Date()).entries(new ArrayList<>()).build();
            for(int j = 0; j<i%5;i++){
                it.getEntries().add(BucketListEntry.builder().title("Title "+(j+i)).build());
            }
            list.add(it);
        }
        return list;
    }
}
