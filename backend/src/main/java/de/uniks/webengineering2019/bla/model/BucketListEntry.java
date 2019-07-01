package de.uniks.webengineering2019.bla.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

@Setter
@Getter
@Builder
@AllArgsConstructor
@Entity
public class BucketListEntry{

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // See JavaDoc for explanation.
    private Long id;

    public String title;
    public String description;
    public Date created;
    //private Date updated;
    //private Date completed;

    public BucketListEntry()
    {
        this.created = new Date();
    }

	/*public static boolean isValid(BucketListEntry addedEntry) {
        //TODO Add check
        return true;
    }*/
}
