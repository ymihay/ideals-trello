import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {
    MovableCardWrapper,
    CardHeader,
    CardRightContent,
    CardTitle,
    Detail,
    Footer
} from 'react-trello/dist/styles/Base'
import Tag from 'react-trello/dist/components/Card/Tag'
import DeleteButton from 'react-trello/dist/widgets/DeleteButton'
import Card from 'react-trello/dist/components/Card'
import InlineInput from 'react-trello/dist/widgets/InlineInput'

class CustomCard extends Card {
    // onDelete = e => {
    //     this.props.onDelete()
    //     e.stopPropagation()
    // }

    render()  {
        const {
            showDeleteButton,
            style,
            tagStyle,
            onClick,
            onDelete,
            className,
            id,
            title,
            label,
            description,
            tags,
            cardDraggable
        } = this.props

        return (
            <MovableCardWrapper
                data-id={id}
                onClick={onClick}
                style={style}
                className={className}
            >
                <CardHeader>
                    {/*<Title draggable={laneDraggable} style={titleStyle}>*/}
                    {/*    {editLaneTitle ?*/}
                    {/*        <InlineInput value={title} border placeholder={t('placeholder.title')} resize='vertical' onSave={updateTitle} /> :*/}
                    {/*        title*/}
                    {/*    }*/}
                    {/*</Title>*/}

                    {/*<CardTitle draggable={cardDraggable}>{title}</CardTitle>*/}
                    <CardTitle draggable={cardDraggable}><InlineInput value={title} border placeholder={'title'} resize='vertical' /></CardTitle>

                    <CardRightContent>{label}</CardRightContent>
                    {showDeleteButton && <DeleteButton onClick={this.onDelete} />}
                </CardHeader>
                {/*<Detail>{description}</Detail>*/}
                <Detail><InlineInput value={description} border placeholder={'title'} resize='vertical' /></Detail>
                {tags && tags.length> 0 && (
                    <Footer>
                        {tags.map(tag => (
                            <Tag key={tag.title} {...tag} tagStyle={tagStyle} />
                        ))}
                    </Footer>
                )}
            </MovableCardWrapper>
        )
    }
}


export default CustomCard
