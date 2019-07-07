package de.uniks.webengineering2019.bla.model;

import com.fasterxml.jackson.annotation.*;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * For now, I'd like to try to store a reference to the master topic, e.g. bucketlist or bucketlistentry so
 * that we can fetch all associated comments with one request.
 * additionally, i'll store a reference to the direct parent
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Comment implements Commentable {

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // See JavaDoc for explanation.
    private Long id;

    private Date created;

    @Column(length = 4096)
    private String comment;

    @OneToMany
    @OrderBy("created DESC")
    private List<Comment> comments;

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private User user;

    @PrePersist
    public void init() {
        if (created == null) {
            created = new Date();
        }
    }

    @Override
    public List<Comment> getComments() {
        if (comments == null) {
            comments = new ArrayList<>();
        }
        return comments;
    }
}
