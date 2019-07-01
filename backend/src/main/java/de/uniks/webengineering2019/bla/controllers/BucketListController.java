package de.uniks.webengineering2019.bla.controllers;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.BucketListEntry;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    /*@GetMapping("/all")
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
    }*/

    @Autowired
    BucketListRepository bucketListRepository;

    @GetMapping("/all")
    public List<BucketList> getAllLists(){
        return bucketListRepository.findAll();
    }
}
